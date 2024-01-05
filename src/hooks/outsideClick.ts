import { useEffect, useState, RefObject, Dispatch, SetStateAction } from 'react';

export default function useOutsideClick(ref:RefObject<HTMLDivElement>):[boolean,Dispatch<SetStateAction<boolean>>] {
  const [isClicked, setIsClicked] = useState<boolean>(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsClicked(false);
      } 
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);

  return [isClicked, setIsClicked];
}
