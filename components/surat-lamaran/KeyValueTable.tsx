export function KeyValueTable({ rows }: { rows: Array<[string, string]> }) {
  return (
    <table className="kv w-full">
      <tbody>
        {rows.map(([label, value], i) => (
          <tr key={i} className="align-top">
            <td className="kv-label">{label}</td>
            <td className="kv-sep">:</td>
            <td className="kv-value">{value || "—"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
