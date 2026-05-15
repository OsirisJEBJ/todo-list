function TextInputWithLabel({
    elementId,
    labelText,
    ref,
    onChange,
    value

}) {
    return (
        <>
            <label htmlFor={elementId}>{labelText}</label>        
            <input
              id={elementId}
              type="text" 
              ref={ref}
              onChange={onChange}
              value={value}
            />
        </>
    );
}

export default TextInputWithLabel;