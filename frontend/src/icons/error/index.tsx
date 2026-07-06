const ErrorIcon = ({ sizes }: { sizes: number }) => {
   return (
      <svg xmlns="http://www.w3.org/2000/svg" width={sizes} height={sizes} viewBox="0 0 48 48"><defs><mask id="ipTError0"><path fill="#555" fillRule="evenodd" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="m6 11l5-5l13 13L37 6l5 5l-13 13l13 13l-5 5l-13-13l-13 13l-5-5l13-13z" clipRule="evenodd" /></mask></defs><path fill="currentColor" d="M0 0h48v48H0z" mask="url(#ipTError0)" /></svg>
   );
}

export default ErrorIcon;