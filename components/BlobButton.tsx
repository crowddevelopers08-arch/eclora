import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

type SharedProps = { children: ReactNode; className?: string };
type BlobLinkProps = SharedProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };
type BlobNativeButtonProps = SharedProps & ButtonHTMLAttributes<HTMLButtonElement>;
type BlobButtonProps = BlobLinkProps | BlobNativeButtonProps;

export function BlobButton(props: BlobButtonProps) {
  const { children, className = '', ...rest } = props;
  const content = <span className="blob-btn__label">{children}</span>;

  if ('href' in rest && rest.href) {
    return <a {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)} className={`blob-btn ${className}`}>{content}</a>;
  }

  return <button {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)} className={`blob-btn ${className}`}>{content}</button>;
}
