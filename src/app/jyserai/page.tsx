import { redirect } from "next/navigation";

// /jyserai seul (sans slug de campagne) n'a rien à afficher — redirige vers l'accueil
// plutôt qu'une 404 brute, au cas où le lien de base est partagé ou tapé par curiosité.
export default function JySeraiIndexPage() {
  redirect("/");
}
