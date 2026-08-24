const INDUSTRY_ICONS = {
  Design: '🎨',
  Technology: '💻',
  Retail: '🛍️',
  Manufacturing: '🏭',
  Transportation: '🚚',
  Healthcare: '🩺',
  Education: '🎓',
  Energy: '⚡',
  Software: '⌨️',
}

function AccountCard({ account }) {
  const { Name, Industry, Phone } = account
  const initials = Name.split(' ')
    .map((word) => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <article className="account-card">
      <header className="account-card__header">
        <div>
          <h3 className="account-card__name">{Name}</h3>
          <span className="account-card__status">Activo</span>
        </div>
        <div className="account-card__avatar" aria-hidden="true">
          {initials}
        </div>
      </header>

      <div className="account-card__body">
        <div className="account-card__row">
          <span className="account-card__icon" aria-hidden="true">
            {INDUSTRY_ICONS[Industry] ?? '🏢'}
          </span>
          <span className="account-card__badge">{Industry}</span>
        </div>
        <div className="account-card__row">
          <span className="account-card__icon" aria-hidden="true">
            📞
          </span>
          <a className="account-card__phone" href={`tel:${Phone.replace(/\s+/g, '')}`}>
            {Phone}
          </a>
        </div>
      </div>
    </article>
  )
}

export default AccountCard
