import Image from "next/image";

interface LogoProps {
  width?: number;
  height?: number;
}

const Logo = ({ width = 200, height = 200 }: LogoProps) => (
  <Image
    src="/atzet/assets/logo.png"
    alt="ATEZT logo"
    width={width}
    height={height}
    unoptimized
    className="object-contain"
  />
);

export default Logo;
