import { CheckIcon } from 'lucide-react';
import { assets } from '../assets/assets';
import { SignedIn, useClerk, useUser } from '@clerk/clerk-react';
import { CheckoutButton, usePlans } from '@clerk/clerk-react/experimental';

type ClerkPlan = ReturnType<typeof usePlans>['data'][number];

const plans = [
    {
        tag: '#1',
        name: 'Free',
        price: '$0',
        image: assets.priceFreeImage,
        features: ['20 Credits', 'Standard quality', 'Watermarked results', 'Slower generation speed', 'email support'],
        clerkPlanSlug: null,
    },
    {
        tag: '#2',
        name: 'Teams',
        price: '$29',
        image: assets.priceTeamsImage,
        features: ['50 Generations / month', 'HD quality', 'No watermark', 'Video generation', 'Priority support'],
        clerkPlanSlug: 'pro',
    },
    {
        tag: '#3',
        name: 'Enterprise',
        price: 'Custom Pricing',
        image: assets.priceEnterpriseImage,
        features: ['Unlimited generations', 'API access', 'Custom models', 'Dedicated manager', 'Chat + Email support'],
        clerkPlanSlug: 'premium',
    },
] as const;

function PricingCard({
    tag,
    name,
    price,
    image,
    features,
    clerkPlanSlug,
    clerkPlan,
    signedIn,
    onSignInRequired,
}: (typeof plans)[number] & {
    clerkPlan: ClerkPlan | undefined;
    signedIn: boolean;
    onSignInRequired: () => void;
}) {
    const purchaseButtonClassName =
        "mt-6 w-full py-3 rounded-full bg-brand text-white font-['Rethink_Sans'] font-medium text-lg transition hover:scale-[1.02] disabled:opacity-50 disabled:pointer-events-none";

    return (
        <div className="bg-[#f4f4f4] rounded-[3rem] p-5 flex flex-col">
            <div className="relative aspect-[409/218] rounded-[2.5rem] overflow-hidden">
                <img src={image} alt="" className="absolute inset-0 size-full object-cover" />
                <div className="absolute inset-0 p-5 flex flex-col justify-end text-white">
                    <span className="font-['Rethink_Sans'] font-medium text-sm">{tag}</span>
                    <span className="font-['Rethink_Sans'] font-medium text-4xl sm:text-5xl leading-tight">{name}</span>
                </div>
            </div>

            <p className="mt-8 text-center font-['Rethink_Sans'] font-medium text-3xl text-brand">{price}</p>

            <ul className="mt-6 space-y-3 flex-1">
                {features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 font-['Rethink_Sans'] font-medium text-lg">
                        <CheckIcon className="size-5 text-brand shrink-0" />
                        {feature}
                    </li>
                ))}
            </ul>

            {clerkPlanSlug === null ? (
                <button className={purchaseButtonClassName}>Purchase Plan</button>
            ) : !signedIn ? (
                <button onClick={onSignInRequired} className={purchaseButtonClassName}>
                    Purchase Plan
                </button>
            ) : clerkPlan ? (
                <SignedIn>
                    <CheckoutButton planId={clerkPlan.id} planPeriod="month">
                        <button className={purchaseButtonClassName}>Purchase Plan</button>
                    </CheckoutButton>
                </SignedIn>
            ) : (
                <button disabled className={purchaseButtonClassName}>
                    Purchase Plan
                </button>
            )}
        </div>
    );
}

export default function Pricing() {
    const { user } = useUser();
    const { openSignIn } = useClerk();
    const { data: clerkPlans } = usePlans();

    return (
        <section id="pricing" className="relative z-10 pb-24 lg:pb-32">
            <div className="max-w-[1400px] mx-auto px-4">
                <img src={assets.pricingHeading} alt="Pricing Plans" className="h-10 sm:h-12 w-auto" />

                <div className="mt-12 lg:mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan) => (
                        <PricingCard
                            key={plan.name}
                            {...plan}
                            clerkPlan={clerkPlans.find((p) => p.slug === plan.clerkPlanSlug)}
                            signedIn={!!user}
                            onSignInRequired={() => openSignIn()}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
