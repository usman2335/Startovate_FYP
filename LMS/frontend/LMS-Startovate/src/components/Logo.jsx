const Logo = ({ className = "" }) => {
  return (
    <span
      className={`font-bold text-primary-blue font-[Alexandria] ${className}`}
    >
      <span className="bg-gradient-to-r from-[#568ed2] to-[#00387b] bg-clip-text text-transparent">
        Track.
      </span>
    </span>
  );
};

export default Logo;
