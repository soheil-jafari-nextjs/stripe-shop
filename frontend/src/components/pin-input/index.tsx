'use client';

import { useRef, useState } from 'react';

interface PinInputProps {
   length?: number;
   values: string[];
   setValues: React.Dispatch<React.SetStateAction<string[]>>;
   onComplete?: (pin: string) => void;
}
export default function PinInput({
   length = 5,
   values,
   setValues,
   onComplete,
}: PinInputProps) {
   const inputs = useRef<(HTMLInputElement | null)[]>([]);
   const focus = (index: number) => {
      const input = inputs.current[index];
      if (!input) return;
      input.focus();
      requestAnimationFrame(() => { input.select(); });
   };

   const update = (arr: string[]) => {
      setValues(arr);

      if (arr.every((v) => v !== '')) {
         onComplete?.(arr.join(''));
      }
   };

   const handleChange = (
      index: number,
      e: React.ChangeEvent<HTMLInputElement>
   ) => {
      const value = e.target.value.replace(/\D/g, '');

      if (!value) {
         const arr = [...values];
         arr[index] = '';
         update(arr);
         return;
      }

      const arr = [...values];
      arr[index] = value.slice(-1);
      update(arr);

      if (index < length - 1) {
         focus(index + 1);
      }
   };

   const handleKeyDown = (
      index: number,
      e: React.KeyboardEvent<HTMLInputElement>
   ) => {
      switch (e.key) {
         case 'Backspace': {
            e.preventDefault();

            const arr = [...values];

            if (arr[index] !== '') {
               arr[index] = '';
               update(arr);
            } else if (index > 0) {
               arr[index - 1] = '';
               update(arr);
               focus(index - 1);
            }

            break;
         }

         case 'ArrowLeft':
            e.preventDefault();

            if (index > 0) {
               focus(index - 1);
            }

            break;

         case 'ArrowRight':
            e.preventDefault();

            if (index < length - 1) {
               focus(index + 1);
            }

            break;
      }
   };

   const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => { e.target.select(); };
   const handlePaste = (
      e: React.ClipboardEvent<HTMLInputElement>
   ) => {
      e.preventDefault();

      const pasted = e.clipboardData
         .getData('text')
         .replace(/\D/g, '')
         .slice(0, length);

      if (!pasted) return;

      const arr = Array(length).fill('');

      pasted.split('').forEach((char, index) => {
         arr[index] = char;
      });

      update(arr);

      const next = Math.min(pasted.length, length - 1);

      focus(next);
   };

   return (
      <div className="flex justify-center gap-3">
         {values.map((value, index) => (
            <input
               key={index}
               ref={(el) => {
                  inputs.current[index] = el;
               }}
               type="text"
               inputMode="numeric"
               autoComplete="one-time-code"
               maxLength={1}
               value={value}
               onChange={(e) => handleChange(index, e)}
               onKeyDown={(e) => handleKeyDown(index, e)}
               onPaste={handlePaste}
               onFocus={handleFocus}
               className="
            h-14
            w-14
            rounded-xl
            border-2
            border-gray-300
            bg-white
            text-center
            text-2xl
            font-bold
            outline-none
            transition-all
            duration-200
            focus:border-blue-500
            focus:ring-4
            focus:ring-blue-100
          "
            />
         ))}
      </div>
   );
}