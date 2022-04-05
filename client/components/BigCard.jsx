
export const BigCard = ({ children }) => {
    return (
        <div className='flex flex-col flex-auto bg-white p-5 lg:px-16 lg:py-[60px] rounded-lg shadow-lg shadow-gray-200 overflow-hidden'>
            {children}
        </div>
    )
}