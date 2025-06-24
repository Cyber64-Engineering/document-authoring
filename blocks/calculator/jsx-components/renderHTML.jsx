function RenderNode({ node }) {
  const { tag: Tag = 'div', id, className, attributes = {}, text, children = [] } = node;

  const props = {
    id,
    className,
    ...attributes,
  };

  const childElements = children?.length ? children.map((child, i) => <RenderNode key={i} node={child} />) : text;

  return <Tag {...props}>{childElements}</Tag>;
}

export default function ContentBlock({ nodes }) {
  return (
    <div className="text block" data-block-name="text" data-block-status="loaded">
      <article className="text">
        {nodes.map((node, i) => (
          <RenderNode key={i} node={node} />
        ))}
      </article>
    </div>
  );
}
