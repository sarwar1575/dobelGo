"use client";

import Swal from "sweetalert2";

type AlertType = "success" | "error" | "warning" | "info";

interface AlertOptions {
  type: AlertType;
  title: string;
  text?: string;
  timer?: number;
}

export const showAlert = ({
  type,
  title,
  text,
  timer = 2000,
}: AlertOptions) => {
  Swal.fire({
    icon: type,
    title,
    text,
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer,
    timerProgressBar: true,
  });
};