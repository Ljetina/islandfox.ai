import KeyIcon from '/assets/img/icon/key_icon.png';

export const KeyButton = ({ character }: { character: string }) => {
  return (
    <div
      className="bg-cover bg-center flex items-center justify-center h-12 w-12 rounded"
      style={{
        width: 36,
        height: 36,
        backgroundImage: `url(/assets/img/icon/key_icon.png)`,
      }}
    >
      <span className="font-bold text-blue">{character}</span>
    </div>
  );
};
