'use client';

import type { ComponentPropsWithoutRef } from 'react';
import { forwardRef, useId } from 'react';

import { Primitive } from '@radix-ui/react-primitive';
import clsx from 'clsx';

import { createContext } from '~/libs/create-context';
import { createSplitProps } from '~/utils/create-split-props';

import type { FieldVariants, LabelVariants, RootVariants } from './text-input.css';
import * as styles from './text-input.css';

type TextInputVariants = RootVariants & LabelVariants & FieldVariants;
type TextInputSharedProps = TextInputVariants & {
    type?: 'text' | 'email' | 'password' | 'url' | 'tel' | 'search';
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    readOnly?: boolean;
    placeholder?: string;
};

type TextInputContextType = TextInputSharedProps & {
    textInputId?: string;
};

const [TextInputProvider, useTextInputContext] = createContext<TextInputContextType>({
    name: 'TextInput',
    hookName: 'useTextInputContext',
    providerName: 'TextInputProvider',
});

/* -------------------------------------------------------------------------------------------------
 * TextInput
 * -----------------------------------------------------------------------------------------------*/

type TextInputPrimitiveProps = ComponentPropsWithoutRef<typeof Primitive.div>;
interface TextInputRootProps
    extends Omit<TextInputPrimitiveProps, keyof TextInputSharedProps>,
        TextInputSharedProps {}

const Root = forwardRef<HTMLDivElement, TextInputRootProps>(
    ({ className, children, ...props }, ref) => {
        const textInputId = useId();
        const [textInputRootProps, otherProps] = createSplitProps<TextInputSharedProps>()(props, [
            'type',
            'value',
            'onValueChange',
            'defaultValue',
            'size',
            'disabled',
            'invalid',
            'readOnly',
            'visuallyHidden',
            'placeholder',
        ]);

        const { disabled } = textInputRootProps;

        return (
            <TextInputProvider value={{ textInputId, ...textInputRootProps }}>
                <Primitive.div
                    ref={ref}
                    className={clsx(styles.root({ disabled }), className)}
                    {...otherProps}
                >
                    {children}
                </Primitive.div>
            </TextInputProvider>
        );
    },
);
Root.displayName = 'TextInput.Root';

/* -------------------------------------------------------------------------------------------------
 * TextInput.Label
 * -----------------------------------------------------------------------------------------------*/

type PrimitiveLabelProps = ComponentPropsWithoutRef<typeof Primitive.label>;
interface TextInputLabelProps extends PrimitiveLabelProps {}

const Label = forwardRef<HTMLLabelElement, TextInputLabelProps>(
    ({ htmlFor, className, ...props }, ref) => {
        const { textInputId = htmlFor, visuallyHidden } = useTextInputContext();

        return (
            <Primitive.label
                ref={ref}
                htmlFor={textInputId}
                className={clsx(styles.label({ visuallyHidden }), className)}
                {...props}
            />
        );
    },
);
Label.displayName = 'TextInput.Label';

/* -------------------------------------------------------------------------------------------------
 * TextInput.Field
 * -----------------------------------------------------------------------------------------------*/

type PrimitiveInputProps = ComponentPropsWithoutRef<typeof Primitive.input>;
interface TextInputFieldProps extends Omit<PrimitiveInputProps, keyof TextInputSharedProps> {}

const Field = forwardRef<HTMLInputElement, TextInputFieldProps>(
    ({ id, className, ...props }, ref) => {
        const {
            type,
            textInputId = id,
            value,
            onValueChange,
            defaultValue,
            disabled,
            invalid,
            readOnly,
            size,
            placeholder,
        } = useTextInputContext();

        return (
            <Primitive.input
                ref={ref}
                id={textInputId}
                type={type}
                value={value}
                onChange={(event) => onValueChange?.(event.target.value)}
                defaultValue={defaultValue}
                disabled={disabled}
                aria-invalid={invalid}
                readOnly={readOnly}
                placeholder={placeholder}
                className={clsx(styles.field({ invalid, size }), className)}
                {...props}
            />
        );
    },
);
Field.displayName = 'TextInput.Field';

/* -----------------------------------------------------------------------------------------------*/

export { Root as TextInputRoot, Label as TextInputLabel, Field as TextInputField };
export type { TextInputRootProps, TextInputLabelProps, TextInputFieldProps };

export const TextInput = { Root, Label, Field };
