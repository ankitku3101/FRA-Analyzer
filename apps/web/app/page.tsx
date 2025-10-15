import Image, { type ImageProps } from "next/image";
import { Hero } from "./sections/Hero";
import { ThemeToggleIcon } from "@/components/ui/theme-toggle";


type Props = Omit<ImageProps, "src"> & {
  srcLight: string;
  srcDark: string;
};

const ThemeImage = (props: Props) => {
  const { srcLight, srcDark, ...rest } = props;

  return (
    <>
      <Image {...rest} src={srcLight} className="imgLight" />
      <Image {...rest} src={srcDark} className="imgDark" />
    </>
  );
};

export default function Home() {
  return (
    <div className="relative">
      <div className="fixed top-4 right-4 z-50">
      <ThemeToggleIcon />
      </div>
      <div className="absolute inset-x-0 top-0 flex h-full w-full items-center justify-center opacity-100">
      <img
        alt="background"
        src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/patterns/square-alt-grid.svg"
        className="opacity-40 [mask-image:radial-gradient(75%_75%_at_center,white,transparent)]"
      />
      </div>
      <Hero />

      <footer className="mb-4 flex justify-center">
      <p className="text-sm text-gray-600 dark:text-gray-300">
        Made with <span aria-hidden="true">❤️</span> By Team <span className="text-primary font-semibold">ARCUS</span>
      </p>
      </footer>
    </div>
  );
}