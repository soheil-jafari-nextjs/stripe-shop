import ErrorIcon from '@/icons/error';
import LoadingIcon from '@/icons/loading';
import SuccessIcon from '@/icons/success';
import WarningIcon from '@/icons/warning';
import { Toaster } from 'sonner';

const ToastProvider = ({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) => {
   return (
      <>
         {children}
         <Toaster
            closeButton={true}
            position="top-center"
            visibleToasts={1}
            richColors
            dir="rtl"
            theme={'dark'}
            toastOptions={{
               className: 'toast_style',
            }}
            icons={{
               success: <SuccessIcon sizes={25} />,
               info: <LoadingIcon sizes={25} />,
               warning: <WarningIcon sizes={25} />,
               error: <ErrorIcon sizes={25} />,
               loading: <LoadingIcon sizes={25} />,
            }}
         />
      </>
   );
}

export default ToastProvider;