<script setup lang="ts">
import { useGameStore } from '@/stores/game'
const game = useGameStore()
</script>

<template>
  <div class="flex items-center  gap-2 bg-blue-800 grow text-3xl text-amber-400 flex-col p-4">
    <div class="flex justify-center flex-col items-center">
        <h1>Velkommen til Væbnermesterskabets Netoplevelse 2024</h1>
        <h1 class="text-amber-300">Ta med ud og Fisk</h1>
        <br/>
        <h2>Spillet begynder om: {{ game.timeToStartLocale }}</h2>
    </div>
    <div class="w-full m-5">
        <div class="text-xl text-justify py-5">
            <p>Velkommen til Netoplevelsen "Ta med ud og fisk", hvor patruljerne
            kæmper om at blive mestre i havets rigdomme.  I dette spil
            får I mulighed for at forvalte jeres eget fiskeriimperium, opbygge
            en flåde, udnytte fiskeressourcerne og handle på fiskemarkedet. Kæmp om at opnå den højeste profit, og klatr op ad rangstigen ved at sælge og handle fisk klogt. Så træk i arbejdstøjet, kast linen ud, og lad kampen om dominans i havet begynde!</p>
            <p>
                I spillet er der tre hovedområder som I skal arbejde med -
                Rederiet, Fiskemarkedet og Havet. Herunder kan I læse mere om
                hvert område.
            </p>
        </div>
        <div class="flex justify-between gap-4" > 
            <div class="basis-1/3">
                <h1>
                    Rederiet
                </h1>
                <p class="text-lg">
                    Rederiet er stedet I skal gå til hvis i har brug for flere
                    skibe i jeres flåde. Her kan I købe skibe for de penge i
                    tjener - men husk på, penge er point så hvis I bruger alle
                    jeres penge på skibe kommer I ikke til at vinde
                    netoplevelsen. 
                </p>
                <p class="text-lg">
                    For at begrænse mængden af både i havet og
                    beskytte fiskebestanden har fiskerimyndighederne lagt
                    afgifter på køb af både. Det betyder at for hver femte båd I
                    køber så stiger priserne på alle både med 5%. Så tænk jeg
                    godt om over hvilke både I vil tilføje til jeres flåde, for
                    I kan ikke sælge dem igen!
                </p>
            </div>
            <div class="basis-1/3">
                <h1>
                    Fiskemarkedet
                </h1>
                <p class="text-lg">

                    På fiksemarkedet kan I sælge alle de fisk I køber. Fiskenes
                    priser afhænger 100% af hvad I og alle de andre patruljer
                    sælger på markedet. Det betyder at hvis alle patruljer
                    begynder at sælge den samme fisk så vil prisen begynde at
                    falde. Samtidig vil de fisk som der ikke er så mange der
                    sælger begynde at stige i pris. Det er altså jeres opgave at
                    finde ud af hvornår i skal slå til at begynde at sælge en
                    fisketype så I ikke misser de gode priser fordi alle andre
                    også beygynder at sælge!
                </p>
            </div>
            <div class="basis-1/3" >
                <h1>
                    Havet
                </h1>
                <p class="text-lg">
                    Det er på havet at man I fanger fisk! I havnen vil I se alle
                    de både som i har I jeres flåde - og I hav områderne vil I
                    kunne se hvilke typer fisk der lever hvor. Tallene ved siden
                    af fiskene indikere hvor mange fisk der er tilbage i
                    bestanden. Når der bliver fisket i et område vil bestanden
                    falde, og den vil stige igen som tiden går når fiskene
                    formere sig. For at sende en båd ud og fiske skal I blot
                    klikek med musen på den båd I vil sende afsted og derefter
                    klikke på det område I gerne vil sende båden afsted til.
                </p>
            </div>
            </div>
    </div>
  </div>
</template>

<style scoped></style>
