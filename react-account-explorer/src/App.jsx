import { useMemo, useState } from 'react'
import AccountCard from './AccountCard.jsx'
import accountsData from './Account_Sample_Data.json'
import './App.css'

function App() {
  const [search, setSearch] = useState('')
  const [industry, setIndustry] = useState('all')
  const [sortAsc, setSortAsc] = useState(true)

  const industries = useMemo(() => {
    return [...new Set(accountsData.map((account) => account.Industry))].sort()
  }, [])

  const filteredAccounts = useMemo(() => {
    const term = search.trim().toLowerCase()

    return accountsData
      .filter((account) => account.Name.toLowerCase().includes(term))
      .filter((account) => industry === 'all' || account.Industry === industry)
      .sort((a, b) =>
        sortAsc
          ? a.Name.localeCompare(b.Name)
          : b.Name.localeCompare(a.Name),
      )
  }, [search, industry, sortAsc])

  return (
    <div className="app">
      <nav className="topbar">
        <div className="topbar__inner">
          <div className="topbar__brand">
            <span className="topbar__logo" aria-hidden="true">
              🏢
            </span>
            <span className="topbar__title">Account Explorer</span>
          </div>
        </div>
      </nav>

      <main className="canvas">
        <header className="page-header">
          <h1 className="page-header__title">Explorar Cuentas</h1>
          <p className="page-header__subtitle">
            Gestione y filtre el directorio de empresas corporativas.
          </p>
        </header>

        <section className="controls">
          <div className="control control--search">
            <label className="control__label" htmlFor="search-account">
              Buscar por nombre
            </label>
            <div className="control__input-wrap">
              <span className="control__input-icon" aria-hidden="true">
                🔍
              </span>
              <input
                id="search-account"
                type="text"
                className="control__input"
                placeholder="Escribe el nombre de una cuenta"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
          </div>

          <div className="control">
            <label className="control__label" htmlFor="filter-industry">
              Filtrar por industria
            </label>
            <select
              id="filter-industry"
              className="control__select"
              value={industry}
              onChange={(event) => setIndustry(event.target.value)}
            >
              <option value="all">Todas las industrias</option>
              {industries.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="control control--sort">
            <span className="control__label">Ordenar</span>
            <button
              type="button"
              className="control__sort-btn"
              onClick={() => setSortAsc((value) => !value)}
            >
              <span aria-hidden="true">{sortAsc ? '↑' : '↓'}</span>
              <span>Orden: {sortAsc ? 'A-Z' : 'Z-A'}</span>
            </button>
          </div>
        </section>

        <div className="results-bar">
          <span className="results-bar__count">
            Mostrando {filteredAccounts.length} de {accountsData.length} cuentas
          </span>
        </div>

        {filteredAccounts.length > 0 ? (
          <div className="account-grid">
            {filteredAccounts.map((account) => (
              <AccountCard key={account.Id} account={account} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <span className="empty-state__icon" aria-hidden="true">
              🔎
            </span>
            <h3 className="empty-state__title">No se encontraron cuentas</h3>
            <p className="empty-state__text">
              Intente ajustar sus filtros de búsqueda o pruebe con un nombre
              diferente para encontrar la cuenta que busca.
            </p>
            <button
              type="button"
              className="empty-state__btn"
              onClick={() => {
                setSearch('')
                setIndustry('all')
              }}
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
