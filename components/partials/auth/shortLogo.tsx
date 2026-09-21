import Image from "next/image";

const ShortLogo = () => (
  <Image
    src="/atzet/assets/logo.png"
    alt="ATEZT logo"
    width={300}
    height={300}
    className="w-40 object-contain"
    unoptimized
  />
);

export default ShortLogo;
