export function getDistanceUntilArrival(feet: number): number {
    const MILE = 5280;

    return feet && feet < MILE ? MILE / feet : feet && feet / MILE;
}