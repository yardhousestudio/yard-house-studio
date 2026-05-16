type Props = {
  anchorId?: string;
};

export function Divider({ anchorId }: Props) {
  return (
    <div id={anchorId} className="mx-auto max-w-content px-6 md:px-8 lg:px-16">
      <hr className="h-px border-0 bg-divider" />
    </div>
  );
}
