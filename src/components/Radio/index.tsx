import React, { InputHTMLAttributes, RefObject, useEffect, useRef } from "react";
import { useField } from "@unform/core";

import styles from './style.module.scss';

interface Options {
  id: string,
  value: string,
  label: string,
}

interface RadioProps {
  name: string,
  label?: string,
  options: Options[],
}

type RefInputEl = RefObject<HTMLInputElement[]>
type InputProps = InputHTMLAttributes<HTMLInputElement> & RadioProps

export default function Radio({ name, label, options, ...rest }: InputProps) {
  const inputRefs = useRef([]);
  const { fieldName, registerField, defaultValue = '', error } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRefs,
      getValue: (refs: RefInputEl) => {
        return refs.current.find(input => input?.checked)?.value
      },
      setValue: (refs: RefInputEl, id: string) => {
        const inputRef = refs.current.find(ref => ref.id === id)
        if (inputRef) inputRef.checked = true
      },
      clearValue: (refs: RefInputEl) => {
        const inputRef = refs.current.find(ref => ref.checked === true)
        if (inputRef) inputRef.checked = false
      },
    })
  }, [fieldName, registerField]);

  return (
    <div className={styles.container}>
      {label && <p>{label}</p>}

      {options.map((option, index) => (
        <span key={option.id}>
          <input
            type="radio"
            ref={ref => {
              inputRefs.current[index] = ref
            }}
            id={option.id}
            name={name}
            defaultChecked={defaultValue.includes(option.id)}
            value={option.value}
            {...rest}
          />

          <label htmlFor={option.id} key={option.id}>
            {option.label}
          </label>
        </span>
      ))}

      {error && <span>{error}</span>}
    </div>
  );
}
