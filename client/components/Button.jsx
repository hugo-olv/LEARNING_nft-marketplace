export const Button = ({ text, disabled, onClick }) => {
    return (
        <button onClick={onClick} disabled={disabled} className={
            `${disabled ? 'bg-[#E6E6E6] text-black cursor-default' : 'bg-black text-white transition-transform hover:-translate-y-[2px] hover:shadow-lg hover:shadow-gray-200'} 
            w-full text-base font-semibold px-5 h-[60px] rounded-xl`
        }>
            {text}
        </button>
    )
}