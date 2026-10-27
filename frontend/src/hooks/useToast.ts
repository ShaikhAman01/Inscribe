import { toast } from "sonner";

export const useToast = () => {
  const showToast = (message: string, type?: 'success' | 'error' | 'warning' | 'info') => {
    const options = { 
      style: { background: 'white', color: 'black' },
    };

    switch (type) {
      case 'success':
        toast.success(message, options);
        break;
      case 'error':
        toast.error(message, options);
        break;
      case 'warning':
        toast.warning(message, options);
        break;
      case 'info':
        toast.info(message, options);
        break;
      default:
        toast(message, options);
    }
  };

  const showPromiseToast = (
    promise: () => Promise<unknown>,
    messages: { loading: string; success: string; error: string | ((error: unknown) => string) }
  ) => {
    toast.promise(promise, {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
    });
  };

  return { showToast, showPromiseToast };
};
