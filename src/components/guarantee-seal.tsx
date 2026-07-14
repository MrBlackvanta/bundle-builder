import Image from "next/image";

export default function GuaranteeSeal() {
  return (
    <Image
      src="/images/guarantee-seal.webp"
      alt="100% Wyze satisfaction guarantee — try worry-free for 30 days"
      width={78}
      height={78}
      sizes="78px"
      className="h-auto w-19.5"
    />
  );
}
