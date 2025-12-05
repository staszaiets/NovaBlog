import React from 'react';
import styles from './PostFilters.module.scss';

const SearchIcon = () => (
  <svg
    width='20'
    height='20'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <circle cx='11' cy='11' r='8'></circle>
    <line x1='21' y1='21' x2='16.65' y2='16.65'></line>
  </svg>
);

interface PostFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedTag: string | null;
  onTagSelect: (tag: string | null) => void;
  availableTags: string[];
}

export const PostFilters = ({
  searchQuery,
  onSearchChange,
  selectedTag,
  onTagSelect,
  availableTags,
}: PostFiltersProps) => {
  return (
    <div className={styles.filters}>
      <div className={styles.searchWrapper}>
        <div className={styles.searchIcon}>
          <SearchIcon />
        </div>
        <input
          type='text'
          placeholder='Пошук статей...'
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {/* Список тегів */}
      {availableTags.length > 0 && (
        <div className={styles.tagsWrapper}>
          <button
            className={`${styles.tagButton} ${selectedTag === null ? styles.active : ''}`}
            onClick={() => onTagSelect(null)}
          >
            Всі
          </button>
          {availableTags.map((tag) => (
            <button
              key={tag}
              className={`${styles.tagButton} ${selectedTag === tag ? styles.active : ''}`}
              onClick={() => onTagSelect(selectedTag === tag ? null : tag)}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
