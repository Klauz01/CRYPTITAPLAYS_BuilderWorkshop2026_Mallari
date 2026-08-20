module portfolio::portfolio;

use std::string::{Self, String};
use sui::object::{Self, UID};
use sui::transfer;
use sui::tx_context::TxContext;
#[test_only]
use sui::test_scenario;

public struct Portfolio has key, store {
    id: UID,
    name: String,
    course: String,
    school: String,
    about: String,
    linkedin_url: String,
    github_url: String,
    skills: String,
}

public fun create_portfolio(
    name: String,
    course: String,
    school: String,
    about: String,
    linkedin_url: String,
    github_url: String,
    skills: String,
    ctx: &mut TxContext,
) {
    let portfolio = Portfolio {
        id: object::new(ctx),
        name,
        course,
        school,
        about,
        linkedin_url,
        github_url,
        skills,
    };

    transfer::public_transfer(portfolio, ctx.sender());
}

#[test_only]
fun text(bytes: vector<u8>): String {
    string::utf8(bytes)
}

#[test]
fun create_portfolio_sets_fields() {
    let sender = @0xA;
    let mut scenario = test_scenario::begin(sender);

    {
        create_portfolio(
            text(b"Ada Builder"),
            text(b"Web3 Foundations"),
            text(b"Cryptita Plays Academy"),
            text(b"Learning to ship on-chain portfolios."),
            text(b"https://www.linkedin.com/in/ada-builder"),
            text(b"https://github.com/ada-builder"),
            text(b"Move, Sui, React"),
            scenario.ctx(),
        );
    };

    scenario.next_tx(sender);
    {
        let portfolio = scenario.take_from_sender<Portfolio>();
        assert!(portfolio.name == text(b"Ada Builder"), 0);
        assert!(portfolio.course == text(b"Web3 Foundations"), 1);
        assert!(portfolio.school == text(b"Cryptita Plays Academy"), 2);
        assert!(portfolio.about == text(b"Learning to ship on-chain portfolios."), 3);
        assert!(portfolio.linkedin_url == text(b"https://www.linkedin.com/in/ada-builder"), 4);
        assert!(portfolio.github_url == text(b"https://github.com/ada-builder"), 5);
        assert!(portfolio.skills == text(b"Move, Sui, React"), 6);
        scenario.return_to_sender(portfolio);
    };

    scenario.end();
}

#[test]
fun create_portfolio_transfers_to_sender() {
    let sender = @0xB;
    let mut scenario = test_scenario::begin(sender);

    {
        create_portfolio(
            text(b"Builder"),
            text(b"Move"),
            text(b"Workshop"),
            text(b"Verifying ownership."),
            text(b"https://linkedin.example"),
            text(b"https://github.example"),
            text(b"Move, Sui"),
            scenario.ctx(),
        );
    };

    scenario.next_tx(sender);
    {
        assert!(scenario.has_most_recent_for_sender<Portfolio>(), 7);
        let portfolio = scenario.take_from_sender<Portfolio>();
        scenario.return_to_sender(portfolio);
    };

    scenario.end();
}
