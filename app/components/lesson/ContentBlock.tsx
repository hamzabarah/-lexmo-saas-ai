'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';

interface ContentBlockProps {
    content: string;
    className?: string;
}

export default function ContentBlock({ content, className = '' }: ContentBlockProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={`prose prose-lg max-w-none ${className}`}
        >
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    // Headings with cyan underline
                    h2: ({ node, ...props }) => (
                        <h2 className="text-3xl font-bold text-[#1A1A2E] mt-12 mb-6 pb-3 border-b-2 border-[#C9A84C]/30" {...props} />
                    ),
                    h3: ({ node, ...props }) => (
                        <h3 className="text-2xl font-semibold text-[#C9A84C] mt-8 mb-4" {...props} />
                    ),
                    h4: ({ node, ...props }) => (
                        <h4 className="text-xl font-semibold text-[#1A1A2E] mt-6 mb-3" {...props} />
                    ),

                    // Paragraphs
                    p: ({ node, ...props }) => (
                        <p className="text-[#1A1A2E] leading-relaxed mb-6 text-lg font-ar" {...props} />
                    ),

                    // Lists
                    ul: ({ node, ...props }) => (
                        <ul className="list-none space-y-3 mb-6 mr-6" {...props} />
                    ),
                    li: ({ node, children, ...props }) => {
                        const text = typeof children === 'string' ? children : '';
                        const isTaskList = text.includes('[ ]') || text.includes('[x]');

                        if (isTaskList) {
                            return (
                                <li className="flex items-start gap-3" {...props}>
                                    {children}
                                </li>
                            );
                        }

                        return (
                            <li className="flex items-start gap-3" {...props}>
                                <span className="text-[#C9A84C] text-xl leading-none mt-1">•</span>
                                <span className="flex-1 text-[#1A1A2E]">{children}</span>
                            </li>
                        );
                    },

                    // Blockquotes (Practical Examples)
                    blockquote: ({ node, ...props }) => (
                        <blockquote className="border-l-4 border-[#B8860B] bg-[#B8860B]/5 pl-6 pr-4 py-4 my-6 rounded-r-lg" {...props} />
                    ),

                    // Tables
                    table: ({ node, ...props }) => (
                        <div className="overflow-x-auto my-8">
                            <table className="w-full border-collapse" {...props} />
                        </div>
                    ),
                    thead: ({ node, ...props }) => (
                        <thead className="bg-[#C9A84C]/10 border-b-2 border-[#C9A84C]" {...props} />
                    ),
                    th: ({ node, ...props }) => (
                        <th className="px-6 py-4 text-right text-[#C9A84C] font-semibold" {...props} />
                    ),
                    td: ({ node, ...props }) => (
                        <td className="px-6 py-4 border-b border-[#E8E0D4] text-[#1A1A2E]" {...props} />
                    ),
                    tr: ({ node, ...props }) => (
                        <tr className="hover:bg-[#F5F1EB] transition-colors" {...props} />
                    ),

                    // Code blocks
                    code: ({ node, inline, className, children, ...props }: any) => {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                            <SyntaxHighlighter
                                style={vscDarkPlus}
                                language={match[1]}
                                PreTag="div"
                                className="rounded-xl my-6 text-sm"
                                {...props}
                            >
                                {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                        ) : (
                            <code className="bg-[#E8E0D4] text-[#C9A84C] px-2 py-1 rounded text-sm font-mono" {...props}>
                                {children}
                            </code>
                        );
                    },

                    // Links
                    a: ({ node, ...props }) => (
                        <a className="text-[#C9A84C] hover:text-[#B8860B] transition-colors underline decoration-[#C9A84C]/30 hover:decoration-[#B8860B]" {...props} />
                    ),

                    // Strong
                    strong: ({ node, ...props }) => (
                        <strong className="text-[#1A1A2E] font-bold" {...props} />
                    ),

                    // Em
                    em: ({ node, ...props }) => (
                        <em className="text-[#C9A84C]" {...props} />
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </motion.div>
    );
}
