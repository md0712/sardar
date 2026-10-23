import React from 'react';

export default function CategoryCard({ category, onSelectCategory }) {
  const { id, name, image, itemCount, badge } = category;

  return (
    <div 
      className="category-card-item"
      onClick={() => onSelectCategory && onSelectCategory(category)}
    >
      <div className="category-circle-wrapper">
        <img 
          src={image} 
          alt={name} 
          className="category-circle-img" 
          loading="lazy"
        />
        {badge && <span className="category-micro-badge">{badge}</span>}
      </div>

      <div className="category-label-box">
        <span className="category-title">{name}</span>
        {itemCount && <span className="category-count">{itemCount}</span>}
      </div>

      <style>{`
        .category-card-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          transition: transform var(--transition-fast);
          user-select: none;
        }
        .category-card-item:hover {
          transform: translateY(-4px);
        }

        .category-circle-wrapper {
          position: relative;
          width: 106px;
          height: 106px;
          border-radius: 50%;
          padding: 4px;
          background: #ffffff;
          box-shadow: 0 4px 12px rgba(42, 24, 16, 0.08);
          border: 2px solid #ecd8cb;
          transition: all var(--transition-fast);
          overflow: hidden;
        }
        .category-card-item:hover .category-circle-wrapper {
          border-color: var(--color-primary);
          box-shadow: 0 8px 20px rgba(162, 78, 35, 0.22);
        }

        .category-circle-img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .category-card-item:hover .category-circle-img {
          transform: scale(1.1);
        }

        .category-micro-badge {
          position: absolute;
          bottom: 2px;
          left: 50%;
          transform: translateX(-50%);
          background: var(--color-primary);
          color: #ffffff;
          font-size: 0.6rem;
          font-weight: 700;
          padding: 1px 6px;
          border-radius: var(--radius-full);
          white-space: nowrap;
          border: 1.5px solid #ffffff;
        }

        .category-label-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        .category-title {
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 0.95rem;
          color: var(--color-text-main);
          transition: color var(--transition-fast);
        }
        .category-card-item:hover .category-title {
          color: var(--color-primary);
        }
        .category-count {
          font-size: 0.72rem;
          color: var(--color-text-light);
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .category-circle-wrapper {
            width: 80px;
            height: 80px;
          }
          .category-title {
            font-size: 0.85rem;
          }
        }
      `}</style>
    </div>
  );
}
