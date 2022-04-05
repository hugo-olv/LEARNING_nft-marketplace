export const TwoColSection = ({ reverse, children }) => {

    const styles = {
        wrapper: 'flex flex-1 justify-center w-full',
        grid: reverse =>
            `grid gap-12 items-start px-6 w-full sm:w-auto
            ${reverse
                ? 'lg:grid-cols-[340px_560px]'
                : 'lg:grid-cols-[560px_340px]'
            }`
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.grid(reverse)}>
                {children}
            </div>
        </div>
    )
}