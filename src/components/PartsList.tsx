import React, { useCallback } from 'react';

import './PartsList.css';

const getImageURL = (name: string) => (
  `https://glyphwiki.org/glyph/${name}.50px.png`
);

interface PartsListProps {
  names: string[];
  handleItemClick: (partName: string, evt: React.MouseEvent<HTMLImageElement>) => void;
  handleItemMouseEnter: (partName: string, evt: React.MouseEvent<HTMLImageElement>) => void;
  handleItemMouseLeave: (evt: React.MouseEvent<HTMLImageElement>) => void;
}

const PartsList = (props: PartsListProps) => {
  const { handleItemClick, handleItemMouseEnter, handleItemMouseLeave } = props;
  const handleImageClick = useCallback((evt: React.MouseEvent<HTMLImageElement>) => {
    const partName = evt.currentTarget.dataset.name!;
    handleItemClick(partName, evt);
  }, [handleItemClick]);
  const handleImageMouseEnter = useCallback((evt: React.MouseEvent<HTMLImageElement>) => {
    const partName = evt.currentTarget.dataset.name!;
    handleItemMouseEnter(partName, evt);
  }, [handleItemMouseEnter]);
  const handleImageMouseLeave = useCallback((evt: React.MouseEvent<HTMLImageElement>) => {
    handleItemMouseLeave(evt);
  }, [handleItemMouseLeave]);

  return (
    <div className="parts-list">
      {props.names.map((name) => (
        <img
          key={name} alt={name} title={name}
          data-name={name}
          src={getImageURL(name)}
          width={50} height={50}
          loading="lazy"
          onClick={handleImageClick}
          onMouseEnter={handleImageMouseEnter}
          onMouseLeave={handleImageMouseLeave}
        />
      ))}
    </div>
  );
};

export default PartsList;
