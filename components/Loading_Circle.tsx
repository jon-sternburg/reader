import styles from '../css/loading_circle_styles.module.css'


export default function Loading_Circle(): JSX.Element {

  return (

    <div className={styles.loading}><div className={styles.lds_default}>
      <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div>

  )



}