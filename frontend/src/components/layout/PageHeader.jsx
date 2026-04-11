const PageHeader = ({ title, subtitle }) => (
  <div className="space-y-1">
    <h1 className="text-2xl font-bold">{title}</h1>
    {subtitle ? <p className="text-sm text-slate-500">{subtitle}</p> : null}
  </div>
);

export default PageHeader;
