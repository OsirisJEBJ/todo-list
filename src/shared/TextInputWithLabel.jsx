function TextInputWithLabel({
    elementId,
    labelText,
    inputRef,
    onChange,
    value

}) {
    return (
        <>
            <label htmlFor={elementId}>{labelText}</label>        
            <input
              id={elementId}
              type="text" 
              ref={inputRef}
              onChange={onChange}
              value={value}
            />
        </>
    );
}

export default TextInputWithLabel;
