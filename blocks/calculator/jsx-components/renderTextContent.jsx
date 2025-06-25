import { RenderElement } from '../../../scripts/preactHelpers.js';

export default function ContentBlockText({ content }) {
  if (content.length === 0) return null;

  return (
    <div className="text block" data-block-name="text" data-block-status="loaded">
      <article className="text">
        {content.map((element, i) => (
          <RenderElement key={i} element={element} />
        ))}
      </article>
    </div>
  );
}
