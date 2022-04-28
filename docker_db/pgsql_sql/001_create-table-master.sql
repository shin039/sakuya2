-- ============================================================================
-- MASTER TABLE DEFINITION
-- ============================================================================

-- ----------------------------------------------------------------------------
-- CREATE Staff TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS m_staff (
  staff_id serial,
  userid   varchar(20) NOT NULL, -- For Login (Uniqueue)
  passwd   text        NOT NULL, -- For Login
  name     text        NOT NULL,
  birthday date        NOT NULL,
  tel      varchar(15),
  mail     varchar(30),

  is_delete         boolean DEFAULT false,
  regist_staff      integer,
  regist_time       timestamp,
  update_staff      integer,
  update_time       timestamp,

  PRIMARY KEY (staff_id),
  UNIQUE      (userid)
);

-- ----------------------------------------------------------------------------
-- CREATE Goods, Goods Details TABLE
-- ----------------------------------------------------------------------------
-- Goods
CREATE TABLE IF NOT EXISTS m_goods (
  goods_id          serial,
  model_no          text,
  jan               varchar(13),
  category          integer,

  name              text NOT NULL,
  maker_id          integer, -- Company Id
  unit_cost         numeric,
  tax_rate          numeric, -- For Reduced Tax Rate
  ws_price          numeric, -- WholeSale Price (Tax Exclude)
  rt_price          numeric, -- Retail    Price (Tax Exclude)

  is_delete         boolean DEFAULT false,
  regist_staff      integer,
  regist_time       timestamp,
  update_staff      integer,
  update_time       timestamp,

  PRIMARY KEY (goods_id),
  UNIQUE  (model_no)
);

-- Goods Details ( Goods : Goods Details => 1 : 1)
CREATE TABLE IF NOT EXISTS m_goods_details (
  goods_id          integer NOT NULL,

  sales_discription text,
  sales_discript50  varchar(50),
  sales_discript100 varchar(100),
  width             numeric,
  depth             numeric,
  height            numeric,
  composition       text,
  moq               numeric, -- Minimum Order Quantity
  spq               numeric, -- Standard Packing Quantity
  discription       text,

  regist_staff      integer,
  regist_time       timestamp,
  update_staff      integer,
  update_time       timestamp,

  PRIMARY KEY (goods_id)
);

-- Goods Extra ( Goods : Goods Extra => 1 : N)
CREATE TABLE IF NOT EXISTS m_goods_extra (
  goods_id          integer NOT NULL,
  goods_extra_type  integer NOT NULL,

  i01_name         integer,
  i02_name         integer,
  i03_name         integer,
  i04_name         integer,
  i05_name         integer,
  n01_name         numeric,
  n02_name         numeric,
  n03_name         numeric,
  n04_name         numeric,
  n05_name         numeric,
  t01_name         text,
  t02_name         text,
  t03_name         text,
  t04_name         text,
  t05_name         text,

  regist_staff      integer,
  regist_time       timestamp,
  update_staff      integer,
  update_time       timestamp,

  PRIMARY KEY (goods_id, goods_extra_type)
);

-- ----------------------------------------------------------------------------
-- CREATE Goods Type, Goods Extra, Goods Material TABLE
-- ----------------------------------------------------------------------------
-- Goods Type ( Goods : Goods Type => 1 : 1)
CREATE TABLE IF NOT EXISTS m_category (
  category          serial,
  name              varchar(20),
  discription       text,

  is_delete         boolean DEFAULT false,
  regist_staff      integer,
  regist_time       timestamp,
  update_staff      integer,
  update_time       timestamp,

  PRIMARY KEY (category)
);

-- Goods Extra ( Goods Type : Goods Extra Type => 1 : N)
CREATE TABLE IF NOT EXISTS m_goods_extra_type (
  goods_extra_type serial,
  category         integer NOT NULL,

  i01_name         text,
  i02_name         text,
  i03_name         text,
  i04_name         text,
  i05_name         text,
  n01_name         text,
  n02_name         text,
  n03_name         text,
  n04_name         text,
  n05_name         text,
  t01_name         text,
  t02_name         text,
  t03_name         text,
  t04_name         text,
  t05_name         text,

  discription       text,

  regist_staff      integer,
  regist_time       timestamp,
  update_staff      integer,
  update_time       timestamp,

  PRIMARY KEY (goods_extra_type)
);

CREATE INDEX ON m_goods_extra (goods_extra_type);

-- ----------------------------------------------------------------------------
-- CREATE Goods Material TABLE
-- ----------------------------------------------------------------------------
-- Goods Material ( Goods : Goods Material => N : N)
--  => To Link Goods and Material
CREATE TABLE IF NOT EXISTS m_goods_material (
  goods_id          integer,
  material_id       integer, 
 
  is_delete         boolean DEFAULT false,
  regist_staff      integer,
  regist_time       timestamp,
  update_staff      integer,
  update_time       timestamp,

  PRIMARY KEY (goods_id, material_id)
);

-- ----------------------------------------------------------------------------
-- CREATE Material TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS m_material (
  material_id       serial,
  material_type     integer NOT NULL,
  name              text,
  maker_id          integer, -- Company Id

  unit_price        numeric,
  tax               numeric, -- For Reduced Tax Rate

  is_delete         boolean DEFAULT false,
  regist_staff      integer,
  regist_time       timestamp,
  update_staff      integer,
  update_time       timestamp,

  PRIMARY KEY (material_id)
);

-- Material Type ( Material : Material Type => 1 : 1)
CREATE TABLE IF NOT EXISTS m_material_type (
  material_type     serial,
  name              varchar(20),
  discription       text,

  is_delete         boolean DEFAULT false,
  regist_staff      integer,
  regist_time       timestamp,
  update_staff      integer,
  update_time       timestamp,

  PRIMARY KEY (material_type)
);

-- ----------------------------------------------------------------------------
-- CREATE Company, Company Staff TABLE
-- ----------------------------------------------------------------------------
-- Corporate Company or Indivisual Company
CREATE TABLE IF NOT EXISTS m_company (
  company_id        serial,
  name              text    NOT NULL,
  regal_personality varchar(10),
  tel               varchar(15),
  fax               varchar(15),
  address           text,

  is_supplier       boolean NOT NULL, -- is Supplier
  is_customer       boolean NOT NULL, -- is Customer
  is_wholesale      boolean NOT NULL, -- Wholesale available

  payment_way       text,             -- Payment way
  closing_date      varchar(10),      -- Payment term, closing
  payment_date      varchar(10),      -- Payment term, payment

  discription       text,

  is_delete         boolean DEFAULT false,
  regist_staff      integer,
  regist_time       timestamp,
  update_staff      integer,
  update_time       timestamp,

  PRIMARY KEY (company_id)
);

-- Corporate Company's Staff
CREATE TABLE IF NOT EXISTS m_company_staff (
  company_id        integer,
  staff_id          integer,
  name              text    NOT NULL,
  tel               varchar(15),
  fax               varchar(15),
  address           text,
  discription       text,

  is_delete         boolean DEFAULT false,
  regist_staff      integer,
  regist_time       timestamp,
  update_staff      integer,
  update_time       timestamp,

  PRIMARY KEY (company_id, staff_id)
);

-- ----------------------------------------------------------------------------
-- CREATE Discount TABLE
-- ----------------------------------------------------------------------------
-- Companies with special discount
CREATE TABLE IF NOT EXISTS m_discount (
  discount_id       serial,
  goods_id          integer,
  company_id        integer,

  -- use either column
  ratio             numeric, -- Ratio of wholesale price to retail price.
  price             numeric, -- tax exclude. -> refer to the tax on m_goods table

  discription       text,

  is_delete         boolean DEFAULT false,
  regist_staff      integer,
  regist_time       timestamp,
  update_staff      integer,
  update_time       timestamp,

  PRIMARY KEY (discount_id),
  UNIQUE (goods_id, company_id)
);
