"""
Qdrant Server Manager - Automatically starts and manages local Qdrant server
"""
import os
import sys
import time
import subprocess
import platform
import signal
import atexit
from pathlib import Path

class QdrantServerManager:
    def __init__(self):
        self.process = None
        self.qdrant_dir = Path("qdrant_local")
        self.qdrant_exe = self.qdrant_dir / "qdrant.exe"
        self.config_file = self.qdrant_dir / "config.yaml"
        
    def is_qdrant_running(self):
        """Check if Qdrant is already running on port 6333"""
        try:
            import socket
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(1)
            result = sock.connect_ex(('localhost', 6333))
            sock.close()
            return result == 0
        except Exception:
            return False
    
    def start_qdrant_server(self):
        """Start Qdrant server if not already running"""
        if self.is_qdrant_running():
            print("✅ Qdrant server is already running on port 6333")
            return True
        
        print("🚀 Starting Qdrant server...")
        
        # Check if Qdrant executable exists
        if not self.qdrant_exe.exists():
            print(f"❌ Qdrant executable not found: {self.qdrant_exe}")
            print("💡 Make sure Qdrant is installed in qdrant_local directory")
            return False
        
        # Check if config file exists
        if not self.config_file.exists():
            print(f"❌ Qdrant config not found: {self.config_file}")
            return False
        
        try:
            # Start Qdrant server as subprocess
            if platform.system() == "Windows":
                # Windows: Start without showing console window
                startupinfo = subprocess.STARTUPINFO()
                startupinfo.dwFlags |= subprocess.STARTF_USESHOWWINDOW
                startupinfo.wShowWindow = subprocess.SW_HIDE
                
                self.process = subprocess.Popen(
                    [str(self.qdrant_exe), "--config-path", str(self.config_file)],
                    cwd=str(self.qdrant_dir),
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE,
                    startupinfo=startupinfo,
                    creationflags=subprocess.CREATE_NEW_PROCESS_GROUP
                )
            else:
                # Linux/Mac
                self.process = subprocess.Popen(
                    [str(self.qdrant_exe), "--config-path", str(self.config_file)],
                    cwd=str(self.qdrant_dir),
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE
                )
            
            print(f"🔄 Qdrant server starting (PID: {self.process.pid})...")
            
            # Wait for server to be ready
            max_wait = 30  # 30 seconds timeout
            for i in range(max_wait):
                if self.is_qdrant_running():
                    print("✅ Qdrant server is ready!")
                    
                    # Register cleanup function
                    atexit.register(self.stop_qdrant_server)
                    
                    return True
                
                if self.process.poll() is not None:
                    # Process has terminated
                    stdout, stderr = self.process.communicate()
                    print(f"❌ Qdrant server failed to start")
                    print(f"Error: {stderr.decode()}")
                    return False
                
                time.sleep(1)
                if i % 5 == 0:
                    print(f"⏳ Waiting for Qdrant server... ({i+1}/{max_wait}s)")
            
            print("❌ Timeout waiting for Qdrant server to start")
            self.stop_qdrant_server()
            return False
            
        except Exception as e:
            print(f"❌ Error starting Qdrant server: {e}")
            return False
    
    def stop_qdrant_server(self):
        """Stop Qdrant server if we started it"""
        if self.process and self.process.poll() is None:
            print("🛑 Stopping Qdrant server...")
            try:
                if platform.system() == "Windows":
                    # Windows: Send CTRL_BREAK_EVENT
                    self.process.send_signal(signal.CTRL_BREAK_EVENT)
                else:
                    # Linux/Mac: Send SIGTERM
                    self.process.terminate()
                
                # Wait for graceful shutdown
                try:
                    self.process.wait(timeout=5)
                    print("✅ Qdrant server stopped gracefully")
                except subprocess.TimeoutExpired:
                    # Force kill if not stopped gracefully
                    self.process.kill()
                    print("⚠️ Qdrant server force killed")
                    
            except Exception as e:
                print(f"⚠️ Error stopping Qdrant server: {e}")
            
            self.process = None
    
    def ensure_qdrant_running(self):
        """Ensure Qdrant server is running, start if needed"""
        return self.start_qdrant_server()

# Global instance
qdrant_manager = QdrantServerManager()

def start_qdrant_if_needed():
    """Start Qdrant server if needed - called from main.py"""
    return qdrant_manager.ensure_qdrant_running()

def stop_qdrant():
    """Stop Qdrant server - called on shutdown"""
    qdrant_manager.stop_qdrant_server()