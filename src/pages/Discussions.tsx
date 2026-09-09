import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, ThumbsUp, CheckCircle, Search, Plus, X } from 'lucide-react';
import { MOCK_DISCUSSIONS, CATEGORIES } from '../forumData';
import type { Category } from '../forumData';

export default function Discussions() {
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);

  const filteredDiscussions = MOCK_DISCUSSIONS.filter(d => {
    const matchesCategory = activeCategory === 'All' || d.category === activeCategory;
    const matchesSearch = d.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          d.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 0.5rem', letterSpacing: '-0.02em' }}>
            Discussions
          </h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '1rem' }}>
            Ask questions, share ideas, and connect with the community.
          </p>
        </div>
        <button onClick={() => setShowNewModal(true)} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={16} />
          New Discussion
        </button>
      </div>

      <div style={{ display: 'flex', gap: '2rem', flexDirection: 'row', alignItems: 'flex-start' }}>
        
        {/* Sidebar Filters */}
        <div style={{ flex: '0 0 250px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ padding: '1rem' }}>
            <div style={{ position: 'relative', marginBottom: '1rem' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                placeholder="Search discussions..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%', padding: '0.4rem 0.5rem 0.4rem 2rem',
                  borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)',
                  background: 'var(--bg-secondary)', color: 'var(--text-primary)',
                  fontSize: '0.85rem', outline: 'none'
                }}
              />
            </div>

            <h3 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, margin: '0 0 0.75rem' }}>Categories</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <button
                onClick={() => setActiveCategory('All')}
                style={{
                  textAlign: 'left', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)',
                  background: activeCategory === 'All' ? 'var(--bg-tertiary)' : 'transparent',
                  color: activeCategory === 'All' ? 'var(--text-primary)' : 'var(--text-secondary)',
                  border: 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: activeCategory === 'All' ? 600 : 400,
                  transition: 'background 0.2s'
                }}
              >
                All Discussions
              </button>
              {CATEGORIES.map(cat => (
                <button
                  key={cat.name}
                  onClick={() => setActiveCategory(cat.name)}
                  style={{
                    textAlign: 'left', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)',
                    background: activeCategory === cat.name ? 'var(--bg-tertiary)' : 'transparent',
                    color: activeCategory === cat.name ? 'var(--text-primary)' : 'var(--text-secondary)',
                    border: 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: activeCategory === cat.name ? 600 : 400,
                    transition: 'background 0.2s',
                    display: 'flex', alignItems: 'center', gap: '0.5rem'
                  }}
                >
                  <span>{cat.icon}</span> {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Discussion List */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredDiscussions.length === 0 ? (
            <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No discussions found matching your criteria.
            </div>
          ) : (
            filteredDiscussions.map(discussion => {
              const category = CATEGORIES.find(c => c.name === discussion.category);
              
              return (
                <Link 
                  key={discussion.id} 
                  to={`/forum/${discussion.id}`}
                  className="card"
                  style={{ 
                    padding: '1.25rem', textDecoration: 'none', color: 'inherit',
                    display: 'flex', gap: '1rem', alignItems: 'flex-start',
                    transition: 'border-color 0.2s, transform 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--brand-primary)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ 
                    width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-tertiary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, color: 'var(--brand-primary)', flexShrink: 0
                  }}>
                    {discussion.authorAvatar}
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                      <h2 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0, color: 'var(--text-primary)' }}>
                        {discussion.title}
                      </h2>
                      {discussion.isAnswered && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#10b981', fontSize: '0.75rem', fontWeight: 600, background: 'rgba(16, 185, 129, 0.1)', padding: '0.1rem 0.4rem', borderRadius: '1rem' }}>
                          <CheckCircle size={12} /> Answered
                        </span>
                      )}
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '0.75rem', color: category?.color, border: `1px solid ${category?.color}40`, background: `${category?.color}10`, padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 500 }}>
                        {category?.icon} {category?.name}
                      </span>
                      {discussion.tags.map(tag => (
                        <span key={tag} style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'var(--bg-tertiary)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      Opened by <strong>{discussion.author}</strong> • {discussion.createdAt}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
                      <MessageCircle size={16} />
                      {discussion.comments.length}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
                      <ThumbsUp size={16} />
                      {discussion.upvotes}
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>

      {/* New Discussion Modal */}
      {showNewModal && (
        <div className="modal-backdrop" onClick={() => setShowNewModal(false)}>
          <div className="card" style={{ maxWidth: '600px', width: '90%', padding: '2rem' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>Start a Discussion</h2>
              <button onClick={() => setShowNewModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={24} />
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Title</label>
                <input type="text" placeholder="What is this discussion about?" style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', outline: 'none' }} />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Category</label>
                <select style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', outline: 'none' }}>
                  {CATEGORIES.map(cat => <option key={cat.name} value={cat.name}>{cat.name}</option>)}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Content (Markdown Supported)</label>
                <textarea rows={6} placeholder="Write your post here..." style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', outline: 'none', resize: 'vertical' }} />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
              <button onClick={() => setShowNewModal(false)} className="btn btn-outline">Cancel</button>
              <button 
                onClick={() => {
                  alert("This is a frontend mock. In production, this would save the discussion to the database!");
                  setShowNewModal(false);
                }} 
                className="btn btn-primary"
              >
                Post Discussion
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
