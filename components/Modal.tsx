"use client";
import { useCallback, ReactNode } from "react";
import { useReducer } from "react";
import { useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { on } from "events";
const Modal = ({ children }: { children: ReactNode }) => {
  const overlay = useRef<HTMLDivElement>(null);
  const wrapper = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const onDismiss = useCallback(() => {
    router.push("/");
  }, [router]);

  const handleClick = useCallback((e:React.MouseEvent) => {
    if (e.target === overlay.current && onDismiss) {
      onDismiss();
    }
  }, [onDismiss, overlay]);

  return (
    <div ref={overlay} className="modal" onClick={handleClick}>
      <button
        type="button"
        onClick={onDismiss}
        className="absolute top-4 right-8"
      >
        <Image src="/close.svg" width={17} height={17} alt="close" />
      </button>
      <div className="modal_wrapper" ref={wrapper}>
        {children}
      </div>
    </div>
  );
};

export default Modal;
