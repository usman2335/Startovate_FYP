"""
Interactive setup script for Qdrant integration
"""
import os
import sys
import subprocess

def print_header(text):
    """Print a formatted header."""
    print("\n" + "=" * 80)
    print(f"  {text}")
    print("=" * 80 + "\n")

def check_docker():
    """Check if Docker is installed and running."""
    try:
        result = subprocess.run(
            ["docker", "--version"],
            capture_output=True,
            text=True,
            timeout=5
        )
        return result.returncode == 0
    except:
        return False

def check_qdrant_running():
    """Check if Qdrant is already running."""
    try:
        import requests
        response = requests.get("http://localhost:6333/", timeout=2)
        return response.status_code == 200
    except:
        return False

def start_qdrant_docker():
    """Start Qdrant using Docker."""
    print("🐳 Starting Qdrant with Docker...")
    
    # Create storage directory
    os.makedirs("qdrant_storage", exist_ok=True)
    
    # Check if container already exists
    try:
        result = subprocess.run(
            ["docker", "ps", "-a", "--filter", "name=qdrant", "--format", "{{.Names}}"],
            capture_output=True,
            text=True
        )
        
        if "qdrant" in result.stdout:
            print("📦 Qdrant container exists, starting it...")
            subprocess.run(["docker", "start", "qdrant"])
        else:
            print("📦 Creating new Qdrant container...")
            subprocess.run([
                "docker", "run", "-d",
                "--name", "qdrant",
                "-p", "6333:6333",
                "-p", "6334:6334",
                "-v", f"{os.getcwd()}/qdrant_storage:/qdrant/storage",
                "qdrant/qdrant"
            ])
        
        print("✅ Qdrant started successfully!")
        print("🌐 Dashboard: http://localhost:6333/dashboard")
        return True
    
    except Exception as e:
        print(f"❌ Failed to start Qdrant: {e}")
        return False

def install_dependencies():
    """Install required Python packages."""
    print("📦 Installing Python dependencies...")
    
    try:
        subprocess.run([
            sys.executable, "-m", "pip", "install",
            "qdrant-client==1.11.3",
            "sentence-transformers==3.2.1",
            "tqdm"
        ], check=True)
        
        print("✅ Dependencies installed successfully!")
        return True
    
    except Exception as e:
        print(f"❌ Failed to install dependencies: {e}")
        return False

def create_env_file():
    """Create .env file if it doesn't exist."""
    if os.path.exists(".env"):
        print("✅ .env file already exists")
        return True
    
    print("📝 Creating .env file...")
    
    try:
        with open(".env.example", "r") as f:
            content = f.read()
        
        with open(".env", "w") as f:
            f.write(content)
        
        print("✅ .env file created from .env.example")
        print("⚠️ Remember to add your MISTRAL_API_KEY to .env")
        return True
    
    except Exception as e:
        print(f"❌ Failed to create .env file: {e}")
        return False

def run_migration():
    """Run migration script."""
    print("🔄 Migrating embeddings to Qdrant...")
    
    # Check if old embeddings exist
    if not os.path.exists("parsed_content/sentence_transformer_embeddings.npy"):
        print("⚠️ No existing embeddings found")
        print("💡 You'll need to create embeddings first:")
        print("   - Parse PDFs: python parse_pdfs.py")
        print("   - Create embeddings: python qdrant_embeddings.py")
        return False
    
    try:
        result = subprocess.run([sys.executable, "migrate_to_qdrant.py"], check=True)
        print("✅ Migration completed successfully!")
        return True
    
    except Exception as e:
        print(f"❌ Migration failed: {e}")
        return False

def run_tests():
    """Run test suite."""
    print("🧪 Running tests...")
    
    try:
        result = subprocess.run([sys.executable, "test_qdrant_search.py"], check=True)
        print("✅ All tests passed!")
        return True
    
    except Exception as e:
        print(f"❌ Tests failed: {e}")
        return False

def main():
    """Main setup flow."""
    print_header("🚀 Qdrant Setup Wizard")
    
    print("This wizard will help you set up Qdrant for your LCI ChatBot.")
    print("\nSetup options:")
    print("1. Local Qdrant (Docker) - Recommended for development")
    print("2. Qdrant Cloud - Recommended for production")
    print("3. Skip Qdrant setup (manual configuration)")
    
    choice = input("\nEnter your choice (1-3): ").strip()
    
    if choice == "1":
        # Local setup
        print_header("Local Qdrant Setup")
        
        # Check Docker
        if not check_docker():
            print("❌ Docker is not installed or not running")
            print("💡 Install Docker from: https://docs.docker.com/get-docker/")
            return False
        
        print("✅ Docker is available")
        
        # Check if Qdrant is running
        if check_qdrant_running():
            print("✅ Qdrant is already running")
        else:
            if not start_qdrant_docker():
                return False
        
        # Install dependencies
        if not install_dependencies():
            return False
        
        # Create .env file
        if not create_env_file():
            return False
        
        # Ask about migration
        print("\n" + "-" * 80)
        migrate = input("Do you have existing embeddings to migrate? (y/n): ").strip().lower()
        
        if migrate == "y":
            if not run_migration():
                print("\n⚠️ Migration failed, but you can try again later")
        else:
            print("\n💡 You'll need to create embeddings:")
            print("   1. Parse PDFs: python parse_pdfs.py")
            print("   2. Create embeddings: python qdrant_embeddings.py")
        
        # Run tests
        print("\n" + "-" * 80)
        test = input("Run tests now? (y/n): ").strip().lower()
        
        if test == "y":
            run_tests()
        
        print_header("✅ Setup Complete!")
        print("Next steps:")
        print("1. Add your MISTRAL_API_KEY to .env")
        print("2. Start your chatbot: python main.py")
        print("3. Visit Qdrant dashboard: http://localhost:6333/dashboard")
        
    elif choice == "2":
        # Cloud setup
        print_header("Qdrant Cloud Setup")
        
        print("To use Qdrant Cloud:")
        print("1. Sign up at: https://cloud.qdrant.io/")
        print("2. Create a cluster")
        print("3. Get your cluster URL and API key")
        print("4. Update .env file with:")
        print("   QDRANT_URL=https://your-cluster.qdrant.io")
        print("   QDRANT_API_KEY=your_api_key")
        print("5. Run: python qdrant_embeddings.py")
        
        # Install dependencies
        install_dependencies()
        create_env_file()
        
        print("\n✅ Dependencies installed")
        print("⚠️ Remember to configure .env with your Qdrant Cloud credentials")
        
    else:
        # Skip
        print_header("Manual Setup")
        print("Please refer to QDRANT_SETUP_GUIDE.md for manual setup instructions")
    
    return True

if __name__ == "__main__":
    try:
        success = main()
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        print("\n\n⚠️ Setup cancelled by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Setup failed: {e}")
        sys.exit(1)
