interface Props {
    classNameArgs?: String;
    text?: string;
    children?: React.ReactNode;
    url: string;
};

export default function StemLink({ classNameArgs = "", text = "", url, children }: Props): React.JSX.Element {

    return (
        <>
            <strong>
                <a href={url} className={`text-blue-500 ${classNameArgs}`} target="_blank">{text}{children ?? null}</a>
            </strong>

        </>
    );
}