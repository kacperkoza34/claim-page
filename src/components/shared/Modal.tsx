import React from "react";
import { CloseIcon } from "@src/assets/icons/CloseIcon";
import { Button } from "@src/components/shared/Button";
import { clsx } from "clsx";

export interface ModalProps {
  open: boolean;
  handleOnOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  hideCross?: boolean;
}

export const Modal = ({
  children,
  open,
  handleOnOpenChange,
  hideCross,
}: ModalProps) => {
  const modalClassName = clsx(
    "relative flex flex-col w-[670px] z-50 bg-white rounded-[20px] pb-10 pt-7",
    open ? "flex" : "hidden"
  );

  const handleModalClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  return (
    <div
      className={
        open
          ? "fixed inset-0 flex items-center justify-center z-40 bg-backdrop"
          : "hidden"
      }
      onClick={() => handleOnOpenChange(false)}
    >
      <div className={modalClassName} onClick={handleModalClick}>
        {!hideCross ? (
          <div className="w-full px-1">
            <Button
              noBorder
              icon={<CloseIcon />}
              className="flex justify-center items-center px-3 py-2 ml-9 hover:bg-hover"
              onClick={() => handleOnOpenChange(false)}
              transparent
            />
          </div>
        ) : null}
        <div className="flex flex-col">{children}</div>
      </div>
    </div>
  );
};
