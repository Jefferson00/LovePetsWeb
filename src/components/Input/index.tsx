import { HtmlHTMLAttributes, InputHTMLAttributes, useCallback, useEffect, useRef, useState } from 'react';
import { IconBaseProps } from 'react-icons';
import InputMask from 'react-input-mask';

import { useField } from '@unform/core'

import styles from './style.module.scss';
import { FiAlertCircle } from 'react-icons/fi';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    name: string;
    mask?: string;
    isMasked?: boolean;
    icon?: React.ComponentType<IconBaseProps>;
}

interface ContainerProps extends HtmlHTMLAttributes<HTMLElement> {
    isFocused: string;
}

export default function Input({ name, mask, isMasked, icon: Icon, ...rest }: InputProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isFocused, setIsFocused] = useState(false);
    const [isFilled, setIsFilled] = useState(false);
    const [isErrored, setIsErrored] = useState(false);
    const { fieldName, defaultValue, error, registerField } = useField(name);

    const handleInputBlur = useCallback(() => {
        setIsFocused(false);

        setIsFilled(!!inputRef.current?.value);

    }, [])

    const handleInputFocus = useCallback(() => {
        setIsFocused(true);
    }, [])

    useEffect(() => {
        registerField({
            name: fieldName,
            ref: inputRef.current,
            path: 'value',
            setValue(ref: any, value: string) {
                ref.setInputValue(value);
            },
            clearValue(ref: any) {
                ref.setInputValue('');
            },
        });

    }, [fieldName, registerField]);

    useEffect(() => {
        setIsErrored(!!error)
    }, [error, isErrored])

    return (
        <div
            className={styles.container}
            style={isFocused ? {
                borderStyle: 'solid',
                borderWidth: 1,
                borderColor: '#12BABA',
            }
                : isErrored ?
                    {
                        borderStyle: 'solid',
                        borderWidth: 0.5,
                        borderColor: '#d53030',
                    }
                    :
                    {
                        borderStyle: 'solid',
                        borderWidth: 0.5,
                        borderColor: '#BABABA',
                    }
            }>
            {Icon && <Icon size={20} color={(isFocused || isFilled) ? '#12BABA' : undefined} />}
            {isMasked ?
                <InputMask
                    mask={mask}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    defaultValue={defaultValue}
                >
                    {() => <input
                        defaultValue={defaultValue}
                        ref={inputRef}
                        {...rest}
                    />}
                </InputMask>
                :
                <input
                    defaultValue={defaultValue}
                    ref={inputRef}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    {...rest}
                />
            }
            {error &&
                <div className={styles.error}>
                    <FiAlertCircle color="#d53030" size={20} />
                    <span>{error}</span>
                </div>
            }
        </div>
    )
}