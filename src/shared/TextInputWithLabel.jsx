import styles from "./TextInputWithLabel.module.css";
function TextInputWithLabel({
    elementId,
    labelText,
    inputRef,
    onChange,
    value

}) {
    return (
        <div className={styles.container}>
            <label htmlFor={elementId} className={styles.label}>{labelText}</label>        
            <input
              id={elementId}
              type="text" 
              ref={inputRef}
              onChange={onChange}
              value={value}
              className={styles.input}
            />
        </div>
    );
}

export default TextInputWithLabel;
