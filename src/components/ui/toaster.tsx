<<<<<<< HEAD
import { useToast } from "@/hooks/use-toast";
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/toast";

export function Toaster() {
  const { toasts } = useToast();
=======
import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()
>>>>>>> 93ec03dfc2a662c75957e56607bc43c05e1ce8f7

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
<<<<<<< HEAD
              {description && <ToastDescription>{description}</ToastDescription>}
=======
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
>>>>>>> 93ec03dfc2a662c75957e56607bc43c05e1ce8f7
            </div>
            {action}
            <ToastClose />
          </Toast>
<<<<<<< HEAD
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
=======
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
>>>>>>> 93ec03dfc2a662c75957e56607bc43c05e1ce8f7
}
