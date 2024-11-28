'use client';

const SecondSection = ({ backgroundColor }) => {
const textColor = backgroundColor === 'white' ? 'black' : 'white';

return (
    <section
        className="w-screen h-screen flex items-center justify-center"
        style={{
            backgroundColor: backgroundColor, // Colore dinamico passato come prop
            zIndex: 1,
            transition: 'background-color 0.1s linear', // Transizione graduale
        }}
    >
        <h2 className={`text-3xl font-bold`} style={{ color: textColor }}>
            Benvenuto nella Seconda Sezione!
        </h2>
    </section>
);
};

export default SecondSection;