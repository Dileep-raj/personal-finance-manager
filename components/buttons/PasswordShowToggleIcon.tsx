import { EyeIcon, EyeOffIcon } from "lucide-react"
import { ButtonHTMLAttributes } from "react"

interface PasswordButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    hidden: boolean
}

const PasswordShowToggleIcon = ({ hidden = true, ...props }: PasswordButtonProps) => {
    const iconSize = 18
    return <button tabIndex={-1} type="button" {...props} title={hidden ? "Show password" : "Hide password"}>
        {hidden ? <EyeOffIcon size={iconSize} /> : <EyeIcon size={iconSize} />}
    </button>
}

export default PasswordShowToggleIcon;
