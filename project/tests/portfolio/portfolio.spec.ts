// tests/portfolio/portfolio.spec.ts
import { test, expect } from '../base-test';
import { PortfolioPage } from '../../pages/PortfolioPage';
import { buyAsset, sellAsset, getUnits, anOrder } from '../../helpers';

test.describe('Portfolio @portfolio', () => {

  // S1 + S2: Page overview and asset detail panel
  test('portfolio page overview and asset detail panel @smoke @p0 @portfolio', async ({ page }) => {
    const portfolioPage = new PortfolioPage(page);

    // ARRANGE
    await test.step('1- User navigates to the investment app', async () => {
      await portfolioPage.navigate();
    });

    // ASSERT — overview state, before any interaction
    await test.step('2- Verify sidebar shows savings balance, portfolio and available sections', async () => {
      await expect(portfolioPage.savingsBalanceLabel).toBeVisible();
      await expect(portfolioPage.savingsBalance).toBeVisible();
      await expect(portfolioPage.portfolioSectionLabel).toBeVisible();
      await expect(portfolioPage.terniumArgentinaButton).toBeVisible();
      await expect(portfolioPage.availableSectionLabel).toBeVisible();
    });

    await test.step('3- Verify main panel shows total portfolio value and distribution chart', async () => {
      await expect(portfolioPage.totalCarteraLabel).toBeVisible();
      await expect(portfolioPage.portfolioChart).toBeVisible();
    });

    // ACT
    await test.step('4- User clicks first asset in Mi portfolio', async () => {
      await portfolioPage.terniumArgentinaButton.click();
    });

    // ASSERT — detail state, after selecting an asset
    await test.step('5- Verify detail panel shows asset info and both spinbuttons reset to 0', async () => {
      await expect(portfolioPage.mainPanelSecondParagraph).toBeVisible();
      await expect(portfolioPage.detailCotizacion).toBeVisible();
      await expect(portfolioPage.detailCantidadAdquirida).toBeVisible();
      await expect(portfolioPage.detailValorTotal).toBeVisible();
      await expect(portfolioPage.comprarSpinbutton).toBeVisible();
      await expect(portfolioPage.venderSpinbutton).toBeVisible();
      expect(await portfolioPage.getComprarSpinbuttonValue()).toBe(0);
      expect(await portfolioPage.getVenderSpinbuttonValue()).toBe(0);
    });
  });

  // S3: Buy existing portfolio asset
  test('buy existing portfolio asset increases units and decreases balance @smoke @p0 @portfolio', async ({ page }) => {
    const portfolioPage = new PortfolioPage(page);

    // ARRANGE — navigate, select the asset, and read the "before" state
    await test.step('1- User navigates to the app', async () => {
      await portfolioPage.navigate();
    });

    const balanceBefore = await portfolioPage.getSavingsBalance();

    await test.step('2- User selects Ternium Argentina from Mi portfolio', async () => {
      await portfolioPage.terniumArgentinaButton.click();
      await expect(portfolioPage.detailCantidadAdquirida).toBeVisible();
    });

    const unitsBefore = await portfolioPage.getUnitsOwned();
    const price = await portfolioPage.getAssetPrice();

    // ACT
    await test.step('3- User enters quantity 1 and clicks Realizar compra', async () => {
      await portfolioPage.fillComprar(1);
      await expect(portfolioPage.realizarCompraButton).toBeVisible();
      await portfolioPage.clickRealizarCompra();
    });

    // ASSERT
    await test.step('4- Validate units increased by 1, balance decreased by price, spinbutton reset to 0', async () => {
      await expect(portfolioPage.detailCantidadAdquirida).toBeVisible();
      expect(await portfolioPage.getUnitsOwned()).toBe(unitsBefore + 1);
      const expectedBalance = portfolioPage.getExpectedBalanceAfterPurchase(balanceBefore, 1, price);
      expect(await portfolioPage.getSavingsBalance()).toBeCloseTo(expectedBalance, 2);
      expect(await portfolioPage.getComprarSpinbuttonValue()).toBe(0);
    });
  });

  // S4: Buy new asset not currently in portfolio
  test('buy new asset adds it to portfolio and shows vender spinbutton @smoke @p0 @portfolio', async ({ page }) => {
    const portfolioPage = new PortfolioPage(page);

    // ARRANGE
    await test.step('1- User navigates to the app', async () => {
      await portfolioPage.navigate();
    });

    const balanceBefore = await portfolioPage.getSavingsBalance();

    await test.step('2- User clicks Transportadora Gas del Norte from Inversiones disponibles', async () => {
      await portfolioPage.transportadoraGasButton.click();
      await expect(portfolioPage.detailCotizacion).toBeVisible();
    });

    const price = await portfolioPage.getAssetPrice();

    // ASSERT — precondition: a new asset starts with no Vender control
    await test.step('3- Verify only Comprar spinbutton is present (no Vender for new asset)', async () => {
      await expect(portfolioPage.comprarSpinbutton).toBeVisible();
      expect(await portfolioPage.isVenderSpinbuttonVisible()).toBe(false);
    });

    // ACT
    await test.step('4- User buys 1 unit and confirms purchase', async () => {
      await portfolioPage.fillComprar(1);
      await expect(portfolioPage.realizarCompraButton).toBeVisible();
      await portfolioPage.clickRealizarCompra();
    });

    // ASSERT
    await test.step('5- Validate asset appears in Mi portfolio, balance decreased, Vender now visible', async () => {
      await expect(portfolioPage.portfolioAssetButton('Transportadora Gas del Norte')).toBeVisible();
      const expectedBalance = portfolioPage.getExpectedBalanceAfterPurchase(balanceBefore, 1, price);
      expect(await portfolioPage.getSavingsBalance()).toBeCloseTo(expectedBalance, 2);

      await portfolioPage.portfolioAssetButton('Transportadora Gas del Norte').click();
      await expect(portfolioPage.detailCantidadAdquirida).toBeVisible();
      expect(await portfolioPage.isVenderSpinbuttonVisible()).toBe(true);
    });
  });

  // S5 + S6: Sell all units of an asset removes it from portfolio
  test('sell all units removes asset from portfolio and restores balance @smoke @p0 @portfolio', async ({ page }) => {
    const portfolioPage = new PortfolioPage(page);

    // ARRANGE
    await test.step('1- User navigates to the app', async () => {
      await portfolioPage.navigate();
    });

    const balanceBefore = await portfolioPage.getSavingsBalance();

    await test.step('2- User selects Ternium Argentina and reads current position', async () => {
      await portfolioPage.terniumArgentinaButton.click();
      await expect(portfolioPage.detailCantidadAdquirida).toBeVisible();
    });

    const unitsOwned = await portfolioPage.getUnitsOwned();
    const price = await portfolioPage.getAssetPrice();

    // ACT
    await test.step('3- User enters owned quantity in Vender and confirms sale', async () => {
      await portfolioPage.fillVender(unitsOwned);
      await expect(portfolioPage.realizarVentaButton).toBeVisible();
      await portfolioPage.clickRealizarVenta();
    });

    // ASSERT
    await test.step('4- Validate asset removed from portfolio, balance restored, chart shown', async () => {
      await expect(portfolioPage.portfolioAssetButton(process.env.ASSET_PRIMARY_NAME ?? 'Ternium Argentina')).toBeHidden();
      const expectedBalance = portfolioPage.getExpectedBalanceAfterSale(balanceBefore, unitsOwned, price);
      expect(await portfolioPage.getSavingsBalance()).toBeCloseTo(expectedBalance, 2);
      await expect(portfolioPage.totalCarteraLabel).toBeVisible();
      await expect(portfolioPage.portfolioChart).toBeVisible();
    });
  });

  // S7: Buy with insufficient balance — documents known negative balance bug
  test('buying beyond available balance results in negative balance (known bug) @p1 @portfolio', async ({ page }) => {
    const portfolioPage = new PortfolioPage(page);

    // ARRANGE
    await test.step('1- User navigates to the app', async () => {
      await portfolioPage.navigate();
    });

    const balanceBefore = await portfolioPage.getSavingsBalance();

    // ACT
    await test.step('2- User selects an asset and enters a quantity that exceeds available balance', async () => {
      await portfolioPage.terniumArgentinaButton.click();
      await expect(portfolioPage.detailCotizacion).toBeVisible();
      await portfolioPage.fillComprar(999);
      await expect(portfolioPage.realizarCompraButton).toBeVisible();
    });

    await test.step('3- User confirms purchase — no validation error is shown', async () => {
      await portfolioPage.clickRealizarCompra();
    });

    // ASSERT — documents the bug: this SHOULD have been rejected, and wasn't
    await test.step('4- Validate balance is now negative (documents missing validation bug)', async () => {
      const balanceAfter = await portfolioPage.getSavingsBalance();
      expect(balanceAfter).toBeLessThan(0);
      expect(balanceAfter).toBeLessThan(balanceBefore);
    });
  });

  // S8: Selling almost all units leaves a tiny remaining position
  test('selling almost all units leaves a tiny remaining position @p1 @portfolio', async ({ page }) => {
    const portfolioPage = new PortfolioPage(page);

    // ARRANGE — seed a large position via API instead of buying through the UI:
    // this test is about SELLING, so its setup shouldn't depend on the buy flow
    // also working correctly.
    await test.step('1- Seed a large Ternium Argentina position via API', async () => {
      await buyAsset(page.request, anOrder().withAmount(999).build()); // Ternium Argentina is the builder's own default
    });

    await test.step('2- User navigates and selects Ternium Argentina', async () => {
      await portfolioPage.navigate();
      await portfolioPage.terniumArgentinaButton.click();
      await expect(portfolioPage.detailCantidadAdquirida).toBeVisible();
    });

    const unitsBefore = await portfolioPage.getUnitsOwned();

    // ACT
    await test.step('3- User sells all but one unit', async () => {
      await portfolioPage.fillVender(unitsBefore - 1);
      await portfolioPage.clickRealizarVenta();
    });

    // ASSERT
    await test.step('4- Validate exactly one unit remains', async () => {
      expect(await portfolioPage.getUnitsOwned()).toBe(1);
    });

    // CLEANUP — sell the last unit too, restoring this session's position.
    // Not strictly required: this session dies with its browser context
    // either way (see Setup & Cleanup) — but leaving it exact costs one line.
    await sellAsset(page.request, anOrder().withAmount(1).build());
  });

  // S9: A seeded position is reflected correctly, via the seedPosition fixture
  test('a seeded position shows the right unit count @p1 @portfolio', async ({ page, seedPosition }) => {
    const portfolioPage = new PortfolioPage(page);

    // ARRANGE — Setup happens entirely before the app is ever opened: read
    // the current position via API, then seed more via the fixture (buys
    // now, sells back automatically after this test — see base-test.ts).
    const secondaryAssetId = process.env.ASSET_SECONDARY_ID ?? 'a3';
    const unitsBefore = await getUnits(page.request, secondaryAssetId);

    await test.step('1- Seed 50 extra Aluar units via the API', async () => {
      await seedPosition(anOrder().forAsset(secondaryAssetId).withAmount(50).build());
    });

    // ACT — the only navigate() in this test: the app opens already showing the seeded state
    await test.step('2- User navigates and selects Aluar', async () => {
      await portfolioPage.navigate();
      await portfolioPage.portfolioAssetButton(process.env.ASSET_SECONDARY_NAME ?? 'Aluar').click();
      await expect(portfolioPage.detailCantidadAdquirida).toBeVisible();
    });

    // ASSERT — read-only: this test never sells, so the fixture's cleanup
    // can safely reverse exactly what it seeded.
    await test.step('3- Validate units increased by exactly 50', async () => {
      expect(await portfolioPage.getUnitsOwned()).toBe(unitsBefore + 50);
    });
  });

});
