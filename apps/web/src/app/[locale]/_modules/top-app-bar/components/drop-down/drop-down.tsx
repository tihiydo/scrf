import React, { ReactNode, useState } from 'react';
import styles from './dropdown.module.scss';
type DropdownProps = {
    items: ReactNode[]; // масив елементів, що передаються в Dropdown
};

const Dropdown: React.FC<DropdownProps> = ({ items }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={styles.dropdown}>
            <button onClick={toggleDropdown} className={styles.dropdownButton}>
                More
            </button>
            {isOpen && (
                <ul className={styles.dropdownMenu}>
                    {items.map((item, index) => (
                        <li key={index} className={styles.dropdownItem}>
                            {item}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Dropdown;