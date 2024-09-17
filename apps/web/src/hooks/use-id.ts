import { useState } from "react";
import { nanoid } from 'nanoid'

export function useId() {
    const [id] = useState(nanoid());

    return id
}