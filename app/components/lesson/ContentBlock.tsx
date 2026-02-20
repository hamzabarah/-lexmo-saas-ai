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
            className={`prose prose-invert prose-lg max-w-none ${className}`}
        >
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    // Headings with cyan underline
                    h2: ({ node, ...props }) => (
                        <h2 className="text-3xl font-bold text-white mt-12 mb-6 pb-3 border-b-2 border-neo-cyan/30" {...props} />
                    ),
                    h3: ({ node, ...props }) => (
                        <h3 className="text-2xl font-semibold text-neo-cyan mt-8 mb-4" {...props} />
                    ),
                    h4: ({ node, ...props }) => (
                        <h4 className="text-xl font-semibold text-white mt-6 mb-3" {...props} />
                    ),

                    // Paragraphs
                    p: ({ node, ...props }) => (
                        <p className="text-neo-gray-100 leading-relaxed mb-6 text-lg font-ar" {...props} />
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
                                <span className="text-neo-cyan text-xl leading-none mt-1">•</span>
                                <span className="flex-1 text-neo-gray-100">{children}</span>
                            </li>
                        );
                    },

                    // Blockquotes (Practical Examples)
                    blockquote: ({ node, ...props }) => (
                        <blockquote className="border-l-4 border-neo-violet bg-neo-violet/5 pl-6 pr-4 py-4 my-6 rounded-r-lg" {...props} />
                    ),

                    // Tables
                    table: ({ node, ...props }) => (
                        <div className="overflow-x-auto my-8">
                            <table className="w-full border-collapse" {...props} />
                        </div>
                    ),
                    thead: ({ node, ...props }) => (
                        <thead className="bg-neo-cyan/10 border-b-2 border-neo-cyan" {...props} />
                    ),
                    th: ({ node, ...props }) => (
                        <th className="px-6 py-4 text-right text-neo-cyan font-semibold" {...props} />
                    ),
                    td: ({ node, ...props }) => (
                        <td className="px-6 py-4 border-b border-neo-gray-800 text-neo-gray-100" {...props} />
                    ),
                    tr: ({ node, ...props }) => (
                        <tr className="hover:bg-neo-gray-900/50 transition-colors" {...props} />
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
                            <code className="bg-neo-gray-800 text-neo-cyan px-2 py-1 rounded text-sm font-mono" {...props}>
                                {children}
                            </code>
                        );
                    },

                    // Links
                    a: ({ node, ...props }) => (
                        <a className="text-neo-cyan hover:text-neo-violet transition-colors underline decoration-neo-cyan/30 hover:decoration-neo-violet" {...props} />
                    ),

                    // Strong
                    strong: ({ node, ...props }) => (
                        <strong className="text-white font-bold" {...props} />
                    ),

                    // Em
                    em: ({ node, ...props }) => (
                        <em className="text-neo-cyan" {...props} />
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </motion.div>
    );
}
