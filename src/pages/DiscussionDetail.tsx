import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, CheckCircle, ChevronUp } from 'lucide-react';
import { MOCK_DISCUSSIONS, CATEGORIES } from '../forumData';
import type { Discussion } from '../forumData';

export default function DiscussionDetail() {
  const { id } = useParams<{ id: string }>();
  const [discussion, setDiscussion] = useState<Discussion | null>(null);
  const [replyContent, setReplyContent] = useState('');

  useEffect(() => {
    const found = MOCK_DISCUSSIONS.find(d => d.id === id);
    setDiscussion(found || null);
  }, [id]);

  if (!discussion) {
    return <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Discussion not found.</div>;
  }

  const category = CATEGORIES.find(c => c.name === discussion.category);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%', paddingBottom: '4rem' }}>
      <Link to="/forum" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none', color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: 500 }}>
        <ArrowLeft size={16} /> Back to Discussions
      </Link>

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <span style={{ fontSize: '0.8rem', color: category?.color, border: `1px solid ${category?.color}40`, background: `${category?.color}10`, padding: '0.2rem 0.6rem', borderRadius: '1rem', fontWeight: 600 }}>
            {category?.icon} {category?.name}
          </span>
          {discussion.isAnswered && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#10b981', fontSize: '0.8rem', fontWeight: 600, background: 'rgba(16, 185, 129, 0.1)', padding: '0.2rem 0.6rem', borderRadius: '1rem' }}>
              <CheckCircle size={14} /> Answered
            </span>
          )}
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            {discussion.tags.map(tag => (
              <span key={tag} style={{ fontSize: '0.8rem', color: 'var(--text-muted)', background: 'var(--bg-tertiary)', padding: '0.2rem 0.6rem', borderRadius: '1rem' }}>
                #{tag}
              </span>
            ))}
          </div>
        </div>

        <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 1rem', lineHeight: 1.2, color: 'var(--text-primary)' }}>
          {discussion.title}
        </h1>
      </div>

      {/* Original Post */}
      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, color: 'var(--brand-primary)', flexShrink: 0, fontSize: '1.1rem' }}>
          {discussion.authorAvatar}
        </div>
        
        <div className="card" style={{ flex: 1, padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '0.75rem 1.25rem', background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
            <div><strong style={{ color: 'var(--text-primary)' }}>{discussion.author}</strong> asked {discussion.createdAt}</div>
            <span style={{ color: 'var(--text-muted)' }}>Author</span>
          </div>
          <div style={{ padding: '1.25rem' }}>
            <div className="wiki-content">
              <ReactMarkdown>{discussion.content}</ReactMarkdown>
            </div>
          </div>
        </div>

        <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', paddingTop: '0.5rem' }}>
          <button style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--brand-primary)'; e.currentTarget.style.color = 'var(--brand-primary)'; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
            <ChevronUp size={20} />
          </button>
          <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>{discussion.upvotes}</span>
        </div>
      </div>

      {/* Answers/Comments */}
      <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '0 0 1.5rem', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
        {discussion.comments.length} Answers
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {discussion.comments.map(comment => (
          <div key={comment.id} style={{ display: 'flex', gap: '1.5rem', position: 'relative' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, color: 'var(--brand-primary)', flexShrink: 0, fontSize: '1.1rem', zIndex: 2 }}>
              {comment.authorAvatar}
            </div>
            
            <div className="card" style={{ flex: 1, padding: 0, overflow: 'hidden', border: comment.isAnswer ? '1px solid #10b981' : '1px solid var(--border-color)' }}>
              {comment.isAnswer && (
                <div style={{ background: 'rgba(16, 185, 129, 0.1)', borderBottom: '1px solid #10b981', padding: '0.5rem 1.25rem', color: '#10b981', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle size={14} /> Marked as answer by author
                </div>
              )}
              <div style={{ padding: '0.75rem 1.25rem', background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                <div><strong style={{ color: 'var(--text-primary)' }}>{comment.author}</strong> commented {comment.createdAt}</div>
                {discussion.category === 'Q&A' && discussion.author === 'bioinfo_guru' /* mock logic */ && !comment.isAnswer && (
                  <button style={{ background: 'none', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '0.2rem 0.5rem', fontSize: '0.7rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>Mark as Answer</button>
                )}
              </div>
              <div style={{ padding: '1.25rem' }}>
                <div className="wiki-content">
                  <ReactMarkdown>{comment.content}</ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Reply Box */}
      <div style={{ display: 'flex', gap: '1.5rem', marginTop: '3rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '2rem' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--brand-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, color: 'var(--brand-primary)', flexShrink: 0, fontSize: '1.1rem' }}>
          YOU
        </div>
        <div style={{ flex: 1 }}>
          <div className="card" style={{ padding: '0.5rem', marginBottom: '1rem' }}>
            <textarea 
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write a reply... (Supports Markdown)"
              style={{ width: '100%', minHeight: '120px', border: 'none', background: 'transparent', resize: 'vertical', color: 'var(--text-primary)', outline: 'none', padding: '0.5rem', fontSize: '0.9rem', fontFamily: 'inherit' }}
            />
          </div>
          <button className="btn btn-primary">Post Reply</button>
        </div>
      </div>

    </div>
  );
}
