import { RenderElement } from '../../../scripts/preactHelpers.js';

export default function ContentBlockText({ content }) {
  if (content.length === 0) return null;

  return (
    <div className="text" data-block-name="text" data-block-status="loaded">
      <article className="text">
        {content.map(({ elements, index }) => (
          <div id={`${index + 1}-row-content`}>
            {elements.map((element, j) => (
              <RenderElement key={j} element={element} />
            ))}
          </div>
        ))}
      </article>
    </div>
  );
}
